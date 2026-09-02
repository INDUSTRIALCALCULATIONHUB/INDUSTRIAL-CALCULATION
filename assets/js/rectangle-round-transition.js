(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const fields = ["rr-width", "rr-depth", "rr-diameter", "rr-height", "rr-thickness", "rr-offset-x", "rr-offset-y", "rr-divisions"];
  let model = null;
  const value = id => Number($(id).value);
  const fmt = (n, decimals = 1) => n.toLocaleString(undefined, { maximumFractionDigits: decimals });
  const inputs = () => ({ width: value("rr-width"), depth: value("rr-depth"), diameter: value("rr-diameter"), height: value("rr-height"), thickness: value("rr-thickness"), offsetX: value("rr-offset-x"), offsetY: value("rr-offset-y"), divisions: value("rr-divisions") });
  const lineAngle = (a, b) => Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;

  function completeSvg(complete, width, height, margin) {
    const b = TransitionGeometry.bounds(complete.boundary);
    const scale = Math.min((width - margin * 2) / Math.max(1, b.maxX - b.minX), (height - margin * 2) / Math.max(1, b.maxY - b.minY));
    const map = p => ({ x: margin + (p.x - b.minX) * scale, y: height - margin - (p.y - b.minY) * scale });
    const path = complete.boundary.map((p, i) => `${i ? "L" : "M"} ${map(p).x.toFixed(2)} ${map(p).y.toFixed(2)}`).join(" ") + " Z";
    const dimensionedLine = (aRaw, qRaw, css, label, fraction=.5, stagger=-5) => {
      const a = map(aRaw), q = map(qRaw), dx=q.x-a.x, dy=q.y-a.y, pageLength=Math.max(1,Math.hypot(dx,dy)), mx=a.x+dx*fraction-dy/pageLength*stagger, my=a.y+dy*fraction+dx/pageLength*stagger;
      let angle = lineAngle(a, q); if (angle > 90 || angle < -90) angle += 180;
      return `<line x1="${a.x}" y1="${a.y}" x2="${q.x}" y2="${q.y}" class="${css}"/><text x="${mx}" y="${my}" text-anchor="middle" transform="rotate(${angle} ${mx} ${my})" class="length-label">${label}</text>`;
    };
    const generators = complete.panels.map((panel,panelIndex) => panel.placedUpper.map((p, i) => {
      const anchor = panel.placedBottom[i <= Math.floor((panel.placedUpper.length - 1) / 2) ? 0 : 1];
      const lineOnly=panelIndex>0&&i===0;
      return lineOnly?dimensionedLine(anchor,p,"panel-seam","",.7,0).replace(/<text[\s\S]*?<\/text>/,""):dimensionedLine(anchor, p, (i === 0 || i === panel.placedUpper.length - 1) ? "panel-seam" : "dev-line", Math.round(TransitionGeometry.distance2(anchor, p)),.7,i%2?5:-5);
    }).join("")).join("");
    const edgeDimensions = complete.lower.slice(0, -1).map((p, i) => dimensionedLine(p, complete.lower[i + 1], "edge-dimension", Math.round(TransitionGeometry.distance2(p, complete.lower[i + 1])))).join("");
    const segPoint=map(complete.upper[1]),segmentLabel=`CIRC SEGMENT ${TransitionGeometry.distance2(complete.upper[0], complete.upper[1]).toFixed(2)} TYP`;
    const typicalSegment=`<line x1="${segPoint.x}" y1="${segPoint.y}" x2="${width-245}" y2="45" class="leader-line"/><text x="${width-235}" y="48" class="segment-callout">${segmentLabel}</text>`;
    const pointLabels = complete.upper.map((p, i) => { const q = map(p); return `<text x="${q.x}" y="${q.y - 11}" text-anchor="middle" class="point-label">${i}</text>`; }).join("");
    const corners = complete.lower.map((p, i) => { const q = map(p); return `<text x="${q.x}" y="${q.y + 19}" text-anchor="middle" class="corner-label">${String.fromCharCode(65 + i)}</text>`; }).join("");
    return `<path d="${path}" class="dev-outline"/>${generators}${edgeDimensions}${typicalSegment}${pointLabels}${corners}`;
  }

  function renderDevelopment() {
    $("rr-development").setAttribute("viewBox", "0 0 900 620");
    $("rr-development").innerHTML = `<text x="25" y="25" class="drawing-heading">DETAIL OF COMPLETE DEVELOPED PLATE — MID-SURFACE</text>${completeSvg(model.complete, 900, 620, 55)}<text x="25" y="600" class="drawing-note">PLATE THK ${fmt(model.insideInput.thickness,2)} mm</text><text x="875" y="600" text-anchor="end" class="drawing-note">ALL DIMENSIONS IN mm</text>`;
    $("rr-length-table").innerHTML = model.panels.map(panel => panel.generators.map(g => `<tr><td>${panel.name}</td><td>${g.point}</td><td>${g.from}</td><td>${fmt(g.length, 2)} mm</td></tr>`).join("")).join("");
  }

  function renderModel() {
    const c = model.input, j = model.insideInput, maxPlan = Math.max(c.width, c.depth), planScale = 230 / maxPlan, verticalScale = Math.min(.24, 195 / c.height);
    const view = (cx, baseY, centreBottom, insideBottom, offset, title) => {
      const bw = centreBottom * planScale, tw = c.diameter * planScale, h = c.height * verticalScale;
      const bottomL = cx - bw / 2, bottomR = cx + bw / 2, topC = cx + offset * planScale, topL = topC - tw / 2, topR = topC + tw / 2, topY = baseY - h;
      const ticks = () => "";
      const neckTop = topY - 24;
      const thicknessCallout=title==="ELEVATION"?`<line x1="${bottomR}" y1="${baseY-25}" x2="${bottomR+35}" y2="${baseY-45}" class="leader-line"/><text x="${bottomR+40}" y="${baseY-48}" class="dimension-text">PLATE THK ${fmt(j.thickness,2)}</text>`:"";
      return `<g class="ortho-view"><path d="M${bottomL},${baseY} L${topL},${topY} L${topR},${topY} L${bottomR},${baseY} Z"/><g class="transition-guides"><line x1="${bottomL}" y1="${baseY}" x2="${topC}" y2="${topY}"/><line x1="${bottomR}" y1="${baseY}" x2="${topC}" y2="${topY}"/></g><line x1="${topL}" y1="${topY}" x2="${topL}" y2="${neckTop}"/><line x1="${topR}" y1="${topY}" x2="${topR}" y2="${neckTop}"/><line x1="${topL}" y1="${neckTop}" x2="${topR}" y2="${neckTop}"/><line x1="${cx}" y1="${baseY}" x2="${cx}" y2="${topY}" class="centre-line"/><line x1="${topC}" y1="${baseY}" x2="${topC}" y2="${neckTop}" class="circle-centre-line"/><line x1="${bottomL}" y1="${baseY + 20}" x2="${bottomR}" y2="${baseY + 20}" class="dimension-line"/>${ticks(bottomL,baseY+20,bottomR,baseY+20)}<text x="${cx}" y="${baseY + 38}" text-anchor="middle">${fmt(insideBottom, 1)} I/S</text><line x1="${topL}" y1="${neckTop - 17}" x2="${topR}" y2="${neckTop - 17}" class="dimension-line"/>${ticks(topL,neckTop-17,topR,neckTop-17)}<text x="${topC}" y="${neckTop - 25}" text-anchor="middle">Ø ${fmt(j.diameter, 1)} DUCT I/S</text><line x1="${bottomL - 24}" y1="${baseY}" x2="${bottomL - 24}" y2="${topY}" class="dimension-line"/>${ticks(bottomL-24,baseY,bottomL-24,topY)}<text x="${bottomL - 33}" y="${(baseY + topY) / 2}" text-anchor="middle" transform="rotate(-90 ${bottomL - 33} ${(baseY + topY) / 2})">${fmt(j.height, 1)}</text><line x1="${cx}" y1="${topY - 4}" x2="${topC}" y2="${topY - 4}" class="offset-line"/>${ticks(cx,topY-4,topC,topY-4)}<text x="${(cx+topC)/2}" y="${topY - 10}" text-anchor="middle">OFFSET ${title === "ELEVATION" ? "X" : "Y"} = ${fmt(offset,1)}</text>${thicknessCallout}<text x="${cx}" y="${baseY + 62}" text-anchor="middle" class="view-title">${title}</text></g>`;
    };
    const pcx=420,pcy=485,pw=c.width*planScale,pd=c.depth*planScale,pr=c.diameter*planScale/2,ccx=pcx+c.offsetX*planScale,ccy=pcy-c.offsetY*planScale;
    const tl=[pcx-pw/2,pcy-pd/2],tr=[pcx+pw/2,pcy-pd/2],br=[pcx+pw/2,pcy+pd/2],bl=[pcx-pw/2,pcy+pd/2];
    const top=[ccx,ccy-pr],right=[ccx+pr,ccy],bottom=[ccx,ccy+pr],left=[ccx-pr,ccy];
    const straight=(a,b)=>`M${a[0]},${a[1]} L${b[0]},${b[1]}`;
    const surfacePaths=[straight(tl,top),straight(tr,top),straight(tr,right),straight(br,right),straight(br,bottom),straight(bl,bottom),straight(bl,left),straight(tl,left)].join(" ");
    const planBottom=pcy+pd/2,planLeft=pcx-pw/2,planRight=pcx+pw/2;
    const plan=`<g class="ortho-view plan-view"><rect x="${planLeft}" y="${pcy-pd/2}" width="${pw}" height="${pd}"/><circle cx="${ccx}" cy="${ccy}" r="${pr}"/><path d="${surfacePaths}" class="plan-surfaces"/><line x1="${planLeft}" y1="${pcy}" x2="${planRight}" y2="${pcy}" class="centre-line"/><line x1="${pcx}" y1="${pcy-pd/2}" x2="${pcx}" y2="${planBottom}" class="centre-line"/><line x1="${ccx-pr}" y1="${ccy}" x2="${ccx+pr}" y2="${ccy}" class="circle-centre-line"/><line x1="${ccx}" y1="${ccy-pr}" x2="${ccx}" y2="${ccy+pr}" class="circle-centre-line"/><line x1="${pcx}" y1="${pcy}" x2="${ccx}" y2="${pcy}" class="offset-line"/><line x1="${ccx}" y1="${pcy}" x2="${ccx}" y2="${ccy}" class="offset-line"/><text x="${ccx}" y="${ccy-pr-18}" text-anchor="middle" class="dimension-text">X OFFSET = ${fmt(c.offsetX,1)}</text><text x="${planRight+18}" y="${ccy+5}" text-anchor="start" class="dimension-text">Y OFFSET = ${fmt(c.offsetY,1)}</text><line x1="${planLeft}" y1="${planBottom+25}" x2="${planRight}" y2="${planBottom+25}" class="dimension-line"/><line x1="${planLeft}" y1="${planBottom}" x2="${planLeft}" y2="${planBottom+31}" class="extension-line"/><line x1="${planRight}" y1="${planBottom}" x2="${planRight}" y2="${planBottom+31}" class="extension-line"/><text x="${pcx}" y="${planBottom+45}" text-anchor="middle" class="dimension-text">${fmt(j.width,1)} I/S</text><line x1="${planLeft-25}" y1="${pcy-pd/2}" x2="${planLeft-25}" y2="${planBottom}" class="dimension-line"/><line x1="${planLeft-31}" y1="${pcy-pd/2}" x2="${planLeft}" y2="${pcy-pd/2}" class="extension-line"/><line x1="${planLeft-31}" y1="${planBottom}" x2="${planLeft}" y2="${planBottom}" class="extension-line"/><text x="${planLeft-36}" y="${pcy}" text-anchor="middle" class="dimension-text" transform="rotate(-90 ${planLeft-36} ${pcy})">${fmt(j.depth,1)} I/S</text><line x1="${ccx-pr}" y1="${ccy}" x2="${ccx+pr}" y2="${ccy}" class="dimension-line"/><text x="${ccx}" y="${ccy-10}" text-anchor="middle" class="dimension-text">Ø ${fmt(j.diameter,1)}</text><text x="${pcx}" y="${planBottom+70}" text-anchor="middle" class="view-title">PLAN</text></g>`;
    $("rr-model").innerHTML = `<defs><marker id="dimArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" class="arrow-head"/></marker></defs><text x="20" y="25" class="drawing-heading">TRANSITION INPUT GEOMETRY</text>${view(215, 285, c.width, j.width, c.offsetX, "ELEVATION")} ${view(625, 285, c.depth, j.depth, c.offsetY, "SIDE VIEW")}${plan}<text x="420" y="705" text-anchor="middle" class="drawing-note">PLATE THK ${fmt(j.thickness, 2)} · DEVELOPMENT AT MID-SURFACE: Ø${fmt(c.diameter,2)} / ${fmt(c.width,2)} × ${fmt(c.depth,2)}</text>`;
  }

  function calculate() {
    try {
      model = TransitionGeometry.buildTransition(inputs()); $("rr-error").textContent = ""; $("rr-results").hidden = false;
      const openingType = Math.abs(model.insideInput.width - model.insideInput.depth) < 1e-9 ? "Square-to-round" : "Rectangle-to-round";
      $("rr-summary").innerHTML = `<div><span>Transition type</span><strong>${openingType}</strong></div><div><span>Plate thickness</span><strong>${fmt(model.insideInput.thickness, 2)} mm</strong></div><div><span>Minimum true length</span><strong>${fmt(model.summary.minimumGenerator)} mm</strong></div><div><span>Maximum true length</span><strong>${fmt(model.summary.maximumGenerator)} mm</strong></div>`;
      renderModel(); renderDevelopment();
    } catch (error) { model = null; $("rr-results").hidden = true; $("rr-error").textContent = error.message; }
  }

  function download(name, type, content) { const blob = new Blob([content], { type }), link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000); }
  function exportDxf() {
    if (!model) return;
    const entities = [];
    const line = (a, b, layer) => entities.push(`0\nLINE\n8\n${layer}\n10\n${a.x}\n20\n${a.y}\n30\n0\n11\n${b.x}\n21\n${b.y}\n31\n0`);
    const text = (p, label, height, rotation, layer="DIMENSIONS") => entities.push(`0\nTEXT\n8\n${layer}\n7\nICH_TEXT\n10\n${p.x}\n20\n${p.y}\n30\n0\n40\n${height}\n1\n${label}\n50\n${rotation}`);
    const circle = (p, radius, layer) => entities.push(`0\nCIRCLE\n8\n${layer}\n10\n${p.x}\n20\n${p.y}\n30\n0\n40\n${radius}`);
    const b = TransitionGeometry.bounds(model.complete.boundary), span = Math.max(b.maxX - b.minX, b.maxY - b.minY), textHeight = Math.max(8, span / 85);
    const c=model.input,j=model.insideInput,maxPlan=Math.max(c.width,c.depth),inputX=b.minX-maxPlan*3.4,inputBaseY=b.minY;
    const solidTriangle=(tip,p1,p2,layer="DIMENSIONS")=>entities.push(`0\nSOLID\n8\n${layer}\n10\n${tip.x}\n20\n${tip.y}\n30\n0\n11\n${p1.x}\n21\n${p1.y}\n31\n0\n12\n${p2.x}\n22\n${p2.y}\n32\n0\n13\n${p2.x}\n23\n${p2.y}\n33\n0`);
    const arrow=(tip,toward,size=textHeight*.9)=>{const angle=Math.atan2(toward.y-tip.y,toward.x-tip.x),wing=Math.PI/7;solidTriangle(tip,{x:tip.x+size*Math.cos(angle+wing),y:tip.y+size*Math.sin(angle+wing)},{x:tip.x+size*Math.cos(angle-wing),y:tip.y+size*Math.sin(angle-wing)});};
    const dimension=(a,q,label,rotation=0)=>{line(a,q,"DIMENSIONS");arrow(a,q);arrow(q,a);text({x:(a.x+q.x)/2,y:(a.y+q.y)/2+textHeight*.4},label,textHeight,rotation);};
    const inputView=(cx,bottomSize,insideSize,offset,title)=>{
      const bottomL={x:cx-bottomSize/2,y:inputBaseY},bottomR={x:cx+bottomSize/2,y:inputBaseY},topC=cx+offset,topL={x:topC-c.diameter/2,y:inputBaseY+c.height},topR={x:topC+c.diameter/2,y:inputBaseY+c.height};
      line(bottomL,topL,"INPUT_GEOMETRY");line(topL,topR,"INPUT_GEOMETRY");line(topR,bottomR,"INPUT_GEOMETRY");line(bottomR,bottomL,"INPUT_GEOMETRY");line(bottomL,{x:topC,y:topL.y},"INPUT_GUIDES");line(bottomR,{x:topC,y:topL.y},"INPUT_GUIDES");line({x:cx,y:inputBaseY},{x:cx,y:topL.y},"CENTER_LINES");line({x:topC,y:inputBaseY},{x:topC,y:topL.y+textHeight},"CENTER_LINES");
      dimension({x:bottomL.x,y:inputBaseY-textHeight*2},{x:bottomR.x,y:inputBaseY-textHeight*2},`${insideSize} I/S`);dimension({x:topL.x,y:topL.y+textHeight*2},{x:topR.x,y:topR.y+textHeight*2},`DIA ${j.diameter} DUCT I/S`);dimension({x:bottomL.x-textHeight*2,y:inputBaseY},{x:bottomL.x-textHeight*2,y:topL.y},`${j.height}`,90);dimension({x:cx,y:topL.y-textHeight*2},{x:topC,y:topL.y-textHeight*2},`${title==="ELEVATION"?"OFFSET X":"OFFSET Y"} = ${offset}`);if(title==="ELEVATION")text({x:bottomR.x+textHeight*2,y:inputBaseY+c.height*.18},`PLATE THK ${j.thickness} mm`,textHeight,0,"NOTES");text({x:cx-bottomSize/4,y:inputBaseY-textHeight*6},title,textHeight*1.2,0,"NOTES");
    };
    inputView(inputX,c.width,j.width,c.offsetX,"ELEVATION");inputView(inputX+maxPlan*1.55,c.depth,j.depth,c.offsetY,"SIDE VIEW");
    const planC={x:inputX+maxPlan*.75,y:inputBaseY-c.height-maxPlan*.9},planCircle={x:inputX+maxPlan*.75+c.offsetX,y:inputBaseY-c.height-maxPlan*.9+c.offsetY};
    const p1={x:planC.x-c.width/2,y:planC.y-c.depth/2},p2={x:planC.x+c.width/2,y:planC.y-c.depth/2},p3={x:planC.x+c.width/2,y:planC.y+c.depth/2},p4={x:planC.x-c.width/2,y:planC.y+c.depth/2};line(p1,p2,"INPUT_GEOMETRY");line(p2,p3,"INPUT_GEOMETRY");line(p3,p4,"INPUT_GEOMETRY");line(p4,p1,"INPUT_GEOMETRY");circle(planCircle,c.diameter/2,"INPUT_GEOMETRY");
    const ptTop={x:planCircle.x,y:planCircle.y+c.diameter/2},ptRight={x:planCircle.x+c.diameter/2,y:planCircle.y},ptBottom={x:planCircle.x,y:planCircle.y-c.diameter/2},ptLeft={x:planCircle.x-c.diameter/2,y:planCircle.y};
    [[p4,ptTop],[p3,ptTop],[p3,ptRight],[p2,ptRight],[p2,ptBottom],[p1,ptBottom],[p1,ptLeft],[p4,ptLeft]].forEach(pair=>line(pair[0],pair[1],"INPUT_GEOMETRY"));
    line({x:planC.x-c.width/2,y:planC.y},{x:planC.x+c.width/2,y:planC.y},"CENTER_LINES");line({x:planC.x,y:planC.y-c.depth/2},{x:planC.x,y:planC.y+c.depth/2},"CENTER_LINES");line({x:planCircle.x-c.diameter/2,y:planCircle.y},{x:planCircle.x+c.diameter/2,y:planCircle.y},"CENTER_LINES");line({x:planCircle.x,y:planCircle.y-c.diameter/2},{x:planCircle.x,y:planCircle.y+c.diameter/2},"CENTER_LINES");
    if(Math.abs(c.offsetX)>1e-9)dimension({x:planC.x,y:planCircle.y+c.diameter/2+textHeight*3},{x:planCircle.x,y:planCircle.y+c.diameter/2+textHeight*3},`OFFSET X = ${c.offsetX}`);else text({x:planCircle.x-c.diameter/5,y:planCircle.y+c.diameter/2+textHeight*3},"OFFSET X = 0",textHeight,0);
    if(Math.abs(c.offsetY)>1e-9)dimension({x:planCircle.x+c.diameter/2+textHeight*3,y:planC.y},{x:planCircle.x+c.diameter/2+textHeight*3,y:planCircle.y},`OFFSET Y = ${c.offsetY}`,90);else text({x:planC.x+c.width/2+textHeight*2,y:planCircle.y},"OFFSET Y = 0",textHeight,0);
    dimension({x:p1.x,y:p1.y-textHeight*3},{x:p2.x,y:p2.y-textHeight*3},`${j.width} I/S`);dimension({x:p1.x-textHeight*3,y:p1.y},{x:p4.x-textHeight*3,y:p4.y},`${j.depth} I/S`,90);dimension({x:planCircle.x-c.diameter/2,y:planCircle.y},{x:planCircle.x+c.diameter/2,y:planCircle.y},`DIA ${j.diameter}`);
    text({x:planC.x-c.width/5,y:planC.y-c.depth/2-textHeight*7},"PLAN",textHeight*1.2,0,"NOTES");
    model.complete.boundary.forEach((p, i) => line(p, model.complete.boundary[(i + 1) % model.complete.boundary.length], "CUT"));
    model.complete.panels.forEach((panel,panelIndex) => panel.placedUpper.forEach((p, i) => {
      const anchor = panel.placedBottom[i <= Math.floor((panel.placedUpper.length - 1) / 2) ? 0 : 1], layer = (i === 0 || i === panel.placedUpper.length - 1) ? "PANEL_SEAM" : "DEVELOPMENT";
      line(anchor, p, layer);
      if(panelIndex>0&&i===0)return;
      let rotation = lineAngle(anchor, p); if (rotation > 90 || rotation < -90) rotation += 180;
      const fraction=.72,dx=p.x-anchor.x,dy=p.y-anchor.y,lineLength=Math.max(1,Math.hypot(dx,dy)),stagger=(i%2?1:-1)*textHeight*.7;
      text({ x: anchor.x+dx*fraction-dy/lineLength*stagger, y: anchor.y+dy*fraction+dx/lineLength*stagger }, Math.round(TransitionGeometry.distance2(anchor, p)).toString(), textHeight*.68, rotation);
    }));
    const segmentTarget=model.complete.upper[1],segmentNote={x:b.maxX+textHeight*5,y:b.maxY+textHeight*6};line(segmentTarget,segmentNote,"DIMENSIONS");text({x:segmentNote.x+textHeight,y:segmentNote.y},`CIRC SEGMENT ${TransitionGeometry.distance2(model.complete.upper[0],model.complete.upper[1]).toFixed(2)} TYP`,textHeight,0);
    model.complete.lower.slice(0,-1).forEach((p,i) => { const q=model.complete.lower[i+1]; let rotation=lineAngle(p,q); if(rotation>90||rotation< -90)rotation+=180; text({x:(p.x+q.x)/2,y:(p.y+q.y)/2},Math.round(TransitionGeometry.distance2(p,q)).toString(),textHeight,rotation); });
    model.complete.upper.forEach((p,i)=>text({x:p.x,y:p.y+textHeight*1.3},i.toString(),textHeight*.75,0,"POINT_NUMBERS"));
    text({x:b.minX,y:b.maxY+textHeight*5},"COMPLETE RECTANGLE-TO-ROUND DEVELOPMENT - PLATE MID-SURFACE",textHeight*1.25,0,"NOTES");
    text({x:b.minX,y:b.maxY+textHeight*3},`PLATE THK ${fmt(model.insideInput.thickness,2)} mm - DEVELOPMENT AT MID-SURFACE - ALL DIMENSIONS IN mm`,textHeight,0,"NOTES");
    const layers = [["CUT",3,"CONTINUOUS"],["DEVELOPMENT",6,"CONTINUOUS"],["PANEL_SEAM",3,"CONTINUOUS"],["INPUT_GEOMETRY",3,"CONTINUOUS"],["INPUT_GUIDES",3,"CONTINUOUS"],["CENTER_LINES",1,"CENTER"],["DIMENSIONS",5,"CONTINUOUS"],["POINT_NUMBERS",5,"CONTINUOUS"],["NOTES",5,"CONTINUOUS"]].map(([name,color,lineType])=>`0\nLAYER\n2\n${name}\n70\n0\n62\n${color}\n6\n${lineType}`).join("\n");
    const lineTypes=`0\nTABLE\n2\nLTYPE\n70\n2\n0\nLTYPE\n2\nCONTINUOUS\n70\n0\n3\nSolid line\n72\n65\n73\n0\n40\n0\n0\nLTYPE\n2\nCENTER\n70\n0\n3\nCenter ____ _ ____ _\n72\n65\n73\n4\n40\n2\n49\n1.25\n74\n0\n49\n-0.25\n74\n0\n49\n0.25\n74\n0\n49\n-0.25\n74\n0\n0\nENDTAB`;
    const textStyle=`0\nTABLE\n2\nSTYLE\n70\n1\n0\nSTYLE\n2\nICH_TEXT\n70\n0\n40\n0\n41\n1\n50\n0\n71\n0\n42\n2.5\n3\narial.ttf\n4\n\n0\nENDTAB`;
    const dxf=`0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n9\n$INSUNITS\n70\n4\n9\n$LTSCALE\n40\n${Math.max(10,textHeight)}\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n${lineTypes}\n0\nTABLE\n2\nLAYER\n70\n9\n${layers}\n0\nENDTAB\n${textStyle}\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n${entities.join("\n")}\n0\nENDSEC\n0\nEOF\n`;
    download("rectangle-round-complete-development-dimensioned.dxf", "application/dxf", dxf);
  }
  function printDrawing() {
    if (!model) return;
    const popup=window.open("","transitionPrint","width=1200,height=900");
    if(!popup){window.print();return;}
    const geometry=$("rr-model").outerHTML,development=$("rr-development").outerHTML,summary=$("rr-summary").innerHTML;
    const stylesheet=new URL("style.css",window.location.href).href;
    popup.document.write(`<!doctype html><html><head><title>Rectangle / Square-to-Round Development</title><link rel="stylesheet" href="${stylesheet}"><style>body{font-family:Arial,sans-serif;color:#123c53;margin:12mm}h1{font-size:20px}.sheet{break-inside:avoid;margin-bottom:10mm}.sheet svg{width:100%;height:auto;border:1px solid #bbb}.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:10px 0}.summary div{border:1px solid #bbb;padding:7px}.summary span{display:block;font-size:10px}.summary strong{font-size:13px}.print-button{padding:10px 18px;background:#164b73;color:white;border:0;font-weight:bold}@media print{.print-button{display:none}body{margin:5mm}}</style></head><body><button class="print-button" onclick="window.print()">Print / Save PDF</button><h1>Rectangle / Square-to-Round Transition Development</h1><div class="summary">${summary}</div><section class="sheet">${geometry}</section><section class="sheet">${development}</section></body></html>`);
    popup.document.close();popup.focus();
  }
  fields.forEach(id => $(id).addEventListener("input", calculate));
  $("rr-export-dxf").addEventListener("click", exportDxf); $("rr-print").addEventListener("click", printDrawing); calculate();
})();

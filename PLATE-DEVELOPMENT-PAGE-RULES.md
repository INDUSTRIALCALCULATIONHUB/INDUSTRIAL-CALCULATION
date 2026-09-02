# Plate Development Page Rules

## Purpose and scope

Use this file as the local source of truth whenever a plate-development calculator is created or modified for Industrial Calculation Hub. It consolidates the accepted requirements established while developing the rectangle/square-to-round and rectangle-to-rectangle tools.

These rules apply to the browser result, printed/PDF result, and DXF export unless a section explicitly says otherwise. A later page-specific instruction from the user takes precedence over this file.

## Local-only boundary

- Develop and test these tools on the local hard disk.
- Do not deploy, publish, upload, or expose an unfinished tool.
- Do not commit or push changes unless the user explicitly requests it.
- Provide a working `http://127.0.0.1` review link after each completed local update.

## Reusable implementation

- Build each page on the shared geometry and export engine; do not duplicate calculation logic inside page markup.
- Keep geometry/calculation logic separate from screen rendering, DXF rendering, printing, and page controls.
- Use one shared internal model for screen, table, print/PDF, and DXF output so the results cannot disagree.
- Keep all calculations in millimetres.
- Treat square-to-round as the square-input case of the rectangle-to-round tool; do not create a duplicate calculator unless specifically requested.
- A new development page must be linked from the home-page Plate Development Tools section after it is accepted for use.

## Required inputs

Every applicable page must provide:

- Inside dimensions for both openings.
- Vertical transition height.
- Plate thickness.
- Independent X and Y offsets where eccentric geometry is possible.
- Separate X-axis and Y-axis top-plane tilt angles where the destination opening plane can be inclined.
- Division/segment count where triangulation or circular segmentation requires it.

Inputs must be clearly labelled as inside dimensions (`I/S`). State the offset sign convention near the fields. Do not reject a geometrically calculable transition merely because one opening projects partly or completely outside the other opening in plan.

### Angle between top and bottom planes

- Provide separate X-axis and Y-axis tilt inputs for the angle between the top and bottom planes.
- Define X tilt as inclination about the bottom opening X axis and Y tilt as inclination about its Y axis; positive direction must be stated beside the inputs.
- Do not substitute plan rotation for plane inclination.
- Apply both tilts to the actual top-opening 3D coordinates before calculating true lengths and the developed plates.
- Show both tilt values in the input views and include them in DXF and printed/PDF notes.
- Recalculate elevation, side view, plan, dimensions, corner connections, true-length data, and development whenever either tilt changes.

## Mid-surface calculation rule

- Calculate the development at the centre of the plate thickness (plate mid-surface), never directly from the inside or outside skin.
- Convert the entered inside dimensions to the appropriate mid-surface geometry before calculating true lengths and the flat pattern.
- Apply the correct shape-specific thickness allowance. Do not assume that circular and rectangular openings use an identical dimensional conversion.
- Show the entered plate thickness in the summary, elevation/input drawing, developed-plate drawing, printed/PDF result, and DXF notes.
- Mark the development as `DEVELOPMENT AT MID-SURFACE`.

## Required screen output

Show both of the following at the same time:

1. Input geometry with three orthographic views: `ELEVATION`, `SIDE VIEW`, and `PLAN`.
2. The development arrangement required by the geometry-specific rule for that page.

Use one complete, continuous developed plate pattern unless a geometry-specific exception below requires separately fabricated plates. Internal panel boundaries or triangulation lines may be shown inside a complete pattern when required for fabrication.

Do not provide an SVG download/output button on this or future plate-development pages. SVG may still be used internally by the page to render the interactive drawing.

## Orthographic drawing standard

- Draw the actual opening outlines and transition edges in green.
- Show all required construction edges as straight lines unless the real geometry is curved.
- Show centre lines in red using a properly scaled long-dash/short-dash centre-line pattern. They must read as centre lines at the displayed zoom and in CAD.
- Show the centre line of every applicable view.
- Clearly show which end is circular when one end is round and the other is rectangular.
- Display X and Y offset values in non-overlapping locations in their applicable views.
- Do not show triangulation true-length or segment-length callouts in the elevation, side, or plan input views unless the user specifically asks for them there.

### Dimensions in all three views

- Elevation: show bottom width, top width/diameter, and vertical height.
- Side view: show bottom depth/diameter, top depth/diameter, and vertical height.
- Plan: show the relevant width, depth, diameter, X offset, and Y offset dimensions needed to define both openings.
- Use dark blue dimension and extension lines on the light screen background.
- Every dimension line must terminate with clearly filled arrowheads.
- Dimension text must state the value and applicable notation such as `I/S`, `DIA`, `Ø`, or `TYP`.
- Keep dimension text horizontal where practical; rotate vertical dimensions only when it improves clarity.

## Plan-view construction rules

- Plan geometry must represent the actual two openings, including eccentric offsets and rotation.
- Rectangle-to-rectangle: connect each corresponding outer and inner corner with one straight green transition line. Do not add diagonal generator lines to elevation or side view.
- Rectangle/square-to-round: connect the rectangle corners to the correct tangent/division locations on the round opening using straight green construction lines. Do not use freehand or curved substitutes for straight transition lines.
- Allow the round or upper opening to extend outside the lower rectangle in plan when offsets require it.
- Temporary markup colours in a user reference image (for example red or magenta) are explanatory only; use the production colour standard in the finished drawing.

## Complete development drawing

- Produce one connected flat pattern with a closed external cut boundary.
- Show panel seams/fold boundaries in green where required.
- Show triangulation/development construction lines in magenta where required.
- Show point/corner labels only where they assist fabrication and keep them away from dimensions.
- Show circular division segment length on the complete development only, formatted as the numeric value followed by `TYP` (for example `65.65 TYP`).
- Position repeated true-length labels so they do not overlap each other, geometry, point labels, headings, or notes. If space is insufficient, use leaders, staggered placement, selective labelling, or a separate true-length table.
- Do not clip the developed plate to an input-view rectangle or other artificial boundary.
- Do not add an auxiliary top neck unless it is part of the actual developed plate requested by the user.

## Text and layout quality

- No text overlap is permitted in any input view, development view, print/PDF, or DXF.
- Keep headings, view names, notes, point labels, dimensions, and leaders separated at default values and at representative extreme inputs.
- Use the established site typography on screen and a clear CAD-compatible text style in DXF.
- Dimension text must remain legible against linework; use spacing or a background mask/knockout on screen where necessary.
- Recalculate drawing scale and label spacing when values change instead of relying on coordinates that only fit the default example.

## DXF requirements

The DXF must contain:

- Elevation, side view, and plan of the input geometry.
- The complete developed plate pattern.
- The same important dimensions and notes shown on screen.
- Plate thickness and mid-surface-development note.
- Filled dimension arrowheads comparable to the on-screen arrows.
- Properly scaled red CAD centre-line entities using a centre linetype.
- Green geometry/cut/fold entities, magenta triangulation entities, and dark dimension/text entities using distinct, named layers.
- A clear CAD-compatible font/text style.

DXF dimension and annotation placement must be checked independently; copying screen coordinates is not sufficient. Avoid overlapping labels and remove any nonessential auxiliary neck or construction geometry.

## Print and Save PDF

- Provide one working `Print / Save PDF` control.
- The print view must include the input summary, all three dimensioned input views, and the complete developed plate.
- Hide form controls and navigation that are not part of the drawing sheet.
- Verify that the print window opens and that browser Print/Save PDF can be invoked without a blank or clipped result.

## Geometry-specific checks

### Rectangle/square-to-round

- Support centred and eccentric round outlets with independent X/Y offsets.
- Support round-outlet rotation when requested by the page specification.
- Divide the round opening consistently and use the selected division count in calculation, drawing, table, and DXF.
- Show the typical circular segment length only on the complete development.
- Ensure the complete pattern remains valid when the round opening lies outside the rectangle in plan.

### Rectangle-to-rectangle

- Support independent top and bottom widths/depths and X/Y offsets.
- In elevation and side view, show only the real outline edges and centre lines; do not add internal corner-to-corner diagonals.
- In plan, show four straight green lines connecting corresponding top and bottom corners.
- This page is an explicit exception to the general complete-pattern rule: show four separate plate developments rather than one joined development.
- Number and name them consistently as `PLATE 1 — FRONT`, `PLATE 2 — RIGHT`, `PLATE 3 — BACK`, and `PLATE 4 — LEFT` on screen, in print/PDF, in the true-length data, and in DXF.
- Show the cut outline, required diagonal construction line, and all four edge dimensions for each separate plate. Dimension values must come from the shared mid-surface geometry model.
- Lay out the four plates with independent spacing so plate numbers and dimensions cannot overlap adjacent plates.
- Apply the same four-plate arrangement to screen and DXF; do not show a joined rectangle-to-rectangle pattern in one output and separate plates in another.
- In plan view, distribute dimension chains between the left, right, top, and bottom sides. Keep the Y-offset and depth dimensions on separate sides or separate dimension levels.

### Round-to-round reducer

- Support concentric and eccentric configurations.
- Preserve circular segmentation consistently between calculation, screen drawing, true-length data, development, and DXF.

## Acceptance checklist

Before giving the local review link, verify all of the following:

- Inputs recalculate the three views, summary, development, and true-length data.
- Development is calculated at plate mid-surface using the entered thickness.
- Elevation, side view, and plan all show complete arrowed dimensions.
- Centre lines are red, use a readable centre pattern, and appear in every applicable view.
- Required transition lines are green and geometrically straight/correct.
- The required development arrangement is visible and is not clipped: one complete pattern normally, or four separate numbered plates for rectangle-to-rectangle.
- Segment length appears only where the transition type requires it and ends with `TYP`.
- No visible text overlaps at default, offset, rotated, and representative extreme inputs.
- DXF opens with the three input views, complete development, dimensions, notes, colours/layers, and filled arrows intact.
- Print / Save PDF works and the drawing is not clipped.
- No SVG output option is present.
- The page is linked from the home page when ready.
- The local page returns successfully and its review link opens.

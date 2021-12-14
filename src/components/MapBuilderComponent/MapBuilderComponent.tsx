import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./MapBuilderComponent.scss";
import MapBuilder from "../../helpers/mapbuilder/mapbuilder";
import { MAP_MODES } from "../../helpers/mapbuilder/consts";
import Line from "../../helpers/mapbuilder/line";
import { ShapeLike } from "../../helpers/mapbuilder/types/mapbuilder.types";

const MapBuilderComponent = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mapBuilder, setMapBuilder] = useState<MapBuilder | false>(false);
  const [mapMode, setMapMode] = useState<MAP_MODES>(MAP_MODES.NORMAL);
  const [selectedShape, setSelectedShape] = useState<ShapeLike | false>(false);

  useEffect(() => {
    if (!mapBuilder) {
      if (canvasRef.current) {
        const mapBuilder = new MapBuilder({
          canvas: canvasRef.current,
        });

        mapBuilder.on("mode_change", (mode: MAP_MODES) => {
          setMapMode(mode);
        });

        mapBuilder.on("selection_change", (shape: ShapeLike | false) => {
          setSelectedShape(shape);
        });

        mapBuilder.addShape(
          new Line({
            id: "abc",
            x1: 0,
            y1: 0,
            x2: 100,
            y2: 100,
          })
        );

        canvasRef.current.addEventListener("mousemove", (e: MouseEvent) => {
          mapBuilder.mouseX = e.offsetX;
          mapBuilder.mouseY = e.offsetY;
        });

        setMapBuilder(mapBuilder);
      }
    }
  }, [mapBuilder]);

  useEffect(() => {
    if (mapBuilder) mapBuilder.start();
  }, [mapBuilder]);

  const handleNormalClick = useCallback(() => {
    if (mapBuilder) mapBuilder.setMode(MAP_MODES.NORMAL);
  }, [mapBuilder]);

  const handleAddClick = useCallback(() => {
    if (mapBuilder) mapBuilder.setMode(MAP_MODES.ADD);
  }, [mapBuilder]);

  const handleEditClick = useCallback(() => {
    if (mapBuilder) mapBuilder.setMode(MAP_MODES.EDIT);
  }, [mapBuilder]);

  const handleRemoveClick = useCallback(() => {
    if (mapBuilder) mapBuilder.setMode(MAP_MODES.REMOVE);
  }, [mapBuilder]);

  const handleDataUpdate = (
    e: FormEvent<HTMLInputElement>,
    data: ShapeLike
  ) => {
    setSelectedShape(data);
    if (mapBuilder) mapBuilder.updateShape(data);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
        }}
      >
        <canvas ref={canvasRef} width={500} height={500} />
        <div>
          <h3>Lines:</h3>
          <ul className={"objects-list"}>
            {mapBuilder &&
              mapBuilder.lines.map((line: Line, index: number) => (
                <li key={index} onClick={() => mapBuilder.selectShape(line)}>
                  [{line.X1} {line.Y1}] [{line.X2} {line.Y2}] ({line.id}) L:{" "}
                  {line.length}
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <p>Current mode: {mapMode}</p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
          }}
        >
          {mapMode !== MAP_MODES.NORMAL && (
            <button onClick={handleNormalClick}>Normal</button>
          )}
          <button onClick={handleAddClick}>Add Line</button>
          <button onClick={handleEditClick}>Edit Line</button>
          <button onClick={handleRemoveClick}>Remove Line</button>
        </div>
        {mapMode === MAP_MODES.EDIT && selectedShape && (
          <form className={"edit-form"}>
            <div>
              <input type={"text"} disabled value={`${selectedShape.id}`} />
            </div>
            {selectedShape instanceof Line && (
              <div>
                <div>
                  <label>X1:</label>
                  <input
                    type={"text"}
                    value={`${selectedShape.X1}`}
                    onInput={(e) => {
                      handleDataUpdate(
                        e,
                        new Line({
                          id: selectedShape.id,
                          x1: parseInt(e.currentTarget.value) || 0,
                          y1: selectedShape.Y1,
                          x2: selectedShape.X2,
                          y2: selectedShape.Y2,
                        })
                      );
                    }}
                  />
                </div>
                <div>
                  <label>Y1:</label>
                  <input
                    type={"text"}
                    value={`${selectedShape.Y1}`}
                    onInput={(e) => {
                      handleDataUpdate(
                        e,
                        new Line({
                          id: selectedShape.id,
                          x1: selectedShape.X1,
                          y1: parseInt(e.currentTarget.value) || 0,
                          x2: selectedShape.X2,
                          y2: selectedShape.Y2,
                        })
                      );
                    }}
                  />
                </div>
                <div>
                  <label>X2:</label>
                  <input
                    type={"text"}
                    value={`${selectedShape.X2}`}
                    onInput={(e) => {
                      handleDataUpdate(
                        e,
                        new Line({
                          id: selectedShape.id,
                          x1: selectedShape.X1,
                          y1: selectedShape.Y1,
                          x2: parseInt(e.currentTarget.value) || 0,
                          y2: selectedShape.Y2,
                        })
                      );
                    }}
                  />
                </div>
                <div>
                  <label>Y2:</label>
                  <input
                    type={"text"}
                    value={`${selectedShape.Y2}`}
                    onInput={(e) => {
                      handleDataUpdate(
                        e,
                        new Line({
                          id: selectedShape.id,
                          x1: selectedShape.X1,
                          y1: selectedShape.Y1,
                          x2: selectedShape.X2,
                          y2: parseInt(e.currentTarget.value) || 0,
                        })
                      );
                    }}
                  />
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default MapBuilderComponent;

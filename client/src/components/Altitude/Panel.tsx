import * as React from "react";
import { FC } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

interface IPanel {
  showHotline: boolean;
  showHeatmap: boolean;
  toggleShowHotline: (isSelected: boolean) => void;
  toggleShowHeatmap: (isSelected: boolean) => void;
}

const Panel: FC<IPanel> = ({
  showHotline,
  showHeatmap,
  toggleShowHotline,
  toggleShowHeatmap,
}) => {
  const handleClick = () => {
    console.log("clicked");
    toggleShowHeatmap(true);
  };

  return (
    <ToggleButtonGroup
      sx={{ position: "absolute", top: 16, left: 16, zIndex: "tooltip" }}
      aria-multiselectable={"true"}
      orientation={"vertical"}
    >
      <ToggleButton
        value={showHotline}
        selected={showHotline}
        onClick={(_) => toggleShowHotline(showHotline)}
      >
        Hotline
      </ToggleButton>
      <ToggleButton
        value={showHeatmap}
        selected={showHeatmap}
        onClick={(_) => toggleShowHeatmap(showHeatmap)}
      >
        Heatmap
      </ToggleButton>
    </ToggleButtonGroup>

    // <ButtonGroup
    //   sx={{ position: "absolute", top: 16, left: 16, zIndex: "tooltip" }}
    //   orientation={"vertical"}
    // >
    //   <Button onClick={handleClick}>Heatmap</Button>
    // </ButtonGroup>

    // <SpeedDial
    //   ariaLabel="altitude-speeddial"
    //   sx={{ position: "absolute", top: 16, left: 16 }}
    //   direction={"down"}
    //   icon={<SpeedDialIcon />}
    // >
    //   <SpeedDialAction
    //     icon={<LogoDev />} // TODO
    //     tooltipOpen={true}
    //     tooltipPlacement={"right"}
    //     tooltipTitle={"Hotline"}
    //     // onClick={toggleShowHotline}
    //   />
    //   <SpeedDialAction
    //     icon={<LogoDev />} // TODO
    //     tooltipOpen={true}
    //     tooltipPlacement={"right"}
    //     tooltipTitle={"Heatmap"}
    //
    //     // onClick={toggleShowHeatmap}
    //   />
    // </SpeedDial>
    // <div className="panel-wrapper">
    //     <div className="panel-checkboxes">
    //         <Checkbox className="panel-checkbox" html={<p>Hotline</p>} forceState={showHotline} onClick={toggleShowHotline}/>
    //         <Checkbox className="panel-checkbox" html={<p>Heatmap</p>} forceState={showHeatmap} onClick={toggleShowHeatmap}/>
    //     </div>
    // </div>
  );
};

export default Panel;

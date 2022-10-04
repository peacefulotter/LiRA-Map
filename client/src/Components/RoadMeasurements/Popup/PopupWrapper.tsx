import { FC, useEffect, useState } from "react";
import { TwitterPicker } from "react-color";
import { Gradient } from "react-gradient-hook";
import Select from 'react-select';

import { RendererName, rendererTypes } from "../../../models/renderers";

import Checkbox from "../../Checkbox";
import {
  ActiveMeasProperties,
  TagProperties,
} from "../../../models/properties";
import { getTags } from "../../../queries/tags";
import { WaysConditions } from "../../../models/path";
import { getAltitudes } from "../../../queries/altitude";

interface IPopupWrapper {
  defaultOptions: Required<ActiveMeasProperties>;
  setOptions: (newOpts: Required<ActiveMeasProperties>) => void;
}

const PopupWrapper: FC<IPopupWrapper> = ({ defaultOptions, setOptions }) => {
  const [state, setState] = useState(defaultOptions);
  const [availableTags, setTags] = useState<TagProperties[]>();

  const { name, dbName, rendererName, color } = state;

  const update = (key: keyof ActiveMeasProperties) => (val: any) => {
    const temp = { ...state } as any;
    temp[key] = val;
    setState(temp);
    setOptions(temp);
  };

  useEffect(() => {
    getTags((data: TagProperties[]) => {
      console.log("Hilfe " + data);
      data.forEach(function (value) {
        console.log(value.type);
        setTags(data);
      });
    });
  }, []);

  const inputChange =
    (key: keyof ActiveMeasProperties) =>
    ({ target }: any) =>
      update(key)(target.value);

  const tagOptions = availableTags?.map(
    (tag) => <option value={tag.type}>{tag.type}</option>
  );
  
  const tagOptions2 = availableTags?.map((tag) => ({
    value: tag.type,
    label: tag.type,
  }))

  const test = {value: 'yo', label: 'hey'}

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

  return (
    <div className="popup-wrapper">
      <input
        className="sweetalert-input"
        placeholder="Name.."
        type="text"
        defaultValue={name}
        onChange={inputChange("name")}
      />

      {/*<Select
        className="sweetalert-input"
        value={dbName}
        onChange={inputChange("dbName")}
      >
        <option value="" disabled>
          Select measurement...
        </option>
        {tagOptions}
      </Select>*/}

      
      

      
      <Select className="basic-single" classNamePrefix="select" options={tagOptions2} />
      

      <div className="sweetalert-checkboxes">
        {Object.keys(RendererName).map((rName: string, i: number) => (
          <Checkbox
            key={`sweetalert-checkbox-${i}`}
            className="ride-metadata-checkbox"
            html={<div style={{ textTransform: "capitalize" }}>{rName}</div>}
            forceState={rName === rendererName}
            onClick={() => update("rendererName")(rName)}
          />
        ))}
      </div>

      {rendererTypes[rendererName].usePalette ? (
        <Gradient
          key={`gradient-${rendererName}`}
          defaultColors={rendererTypes[rendererName].defaultPalette}
          cursorOptions={{ grid: true, samples: 40 }}
          pickerOptions={{ showCircles: false }}
          onChange={update("palette")}
        />
      ) : (
        <TwitterPicker color={color} onChange={(c) => update("color")(c.hex)} />
      )}
    </div>
  );
};

export default PopupWrapper;

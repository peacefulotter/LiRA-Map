import React, { useState } from 'react';

interface Props {
  html: JSX.Element;
  onClick: (isChecked: boolean, e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  forceState?: boolean;
  style?: React.CSSProperties;
  tooltip?: string;
}

const Checkbox = (props: Props) => {
  const { forceState, className, html, onClick, style, tooltip } = props;
  const [isChecked, setChecked] = useState<boolean>(forceState || false);

  return (
    <div
      className={`${className || ''} btn ${
        (forceState === undefined ? isChecked : forceState) ? 'btn-checked' : ''
      }`}
      style={style}
      onClick={(e) => {
        const update = forceState === undefined ? !isChecked : !forceState;
        onClick(update, e);
        setChecked(update);
      }}
      title={tooltip}
    >
      {html}
    </div>
  );
};
export default Checkbox;

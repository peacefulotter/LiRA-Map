import React, { FC, useEffect, useState } from 'react';
import { FiLoader } from 'react-icons/fi';
import '../css/loading.css';

const mountedStyle = {
  animationName: 'inAnimation',
  animationDuration: '250ms',
  animationTimingFunction: 'ease-in',
  animationFillMode: 'forwards',
};
const unmountedStyle = {
  animationName: 'outAnimation',
  animationDuration: '250ms',
  animationTimingFunction: 'ease-in',
  animationFillMode: 'forwards',
};

const Loading: FC<{ loading: boolean }> = ({ loading }) => {
  const [renderLoading, setRenderLoading] = useState(loading);

  useEffect(() => {
    if (loading) setRenderLoading(true);
  }, [loading]);

  if (!renderLoading) return <></>;

  return (
    <div
      className="loading"
      style={loading ? mountedStyle : unmountedStyle}
      onAnimationEnd={() => {
        if (!loading) setRenderLoading(false);
      }}
    >
      <FiLoader className="load-icon" />
      <span>Loading</span>
    </div>
  );
};

export default Loading;

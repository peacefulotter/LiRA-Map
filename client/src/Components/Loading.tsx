import React, { FC, useEffect, useState } from 'react';
import '../css/loading.css';

const mountedStyle = { animation: 'inAnimation 250ms ease-in' };
const unmountedStyle = {
  animation: 'outAnimation 250ms ease-out',
  animationFillMode: 'forwards',
};

const Loading: FC<{ loading: boolean }> = ({ loading }) => {
  const [renderLoading, setRenderLoading] = useState(loading);

  useEffect(() => {
    console.log(loading);
    if (loading) setRenderLoading(true);
  }, [loading]);

  if (!renderLoading) return <></>;

  return (
    <div
      className="loading"
      style={loading ? mountedStyle : unmountedStyle}
      onAnimationEnd={() => {
        console.log('aniamtion done');
        if (!loading) setRenderLoading(false);
      }}
    >
      <span>Loading...</span>
    </div>
  );
};

export default Loading;

import * as React from 'react';

export default function Loading() {
  return (
    <div className="absolute width-100 height-100 top-0 left-0 flex flex-items-center flex-justify-center"
        style={{ backgroundColor: 'rgba(255, 255, 255, .6)' }}>
      <img src={ require('@/assets/loading.svg') } />
    </div>
  );
}

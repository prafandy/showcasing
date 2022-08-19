import * as React from 'react';

export default function Error({ title = '', message = '', showLoading = false, inlineDisplay = false }) {
  return (
    <div className={`absolute width-100 height-100 top-0 left-0 flex flex-items-center
          ${ inlineDisplay ? '' : 'flex-column flex-justify-center text-center' }
        `}
        style={{ backgroundColor: 'rgba(255, 255, 255, .6)' }}>
      <img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
        className={`width-52px
          ${ inlineDisplay ? 'margin-right-16 padding-y-4' : 'margin-bottom-8' }
        `} />
      <div>
        <div className="h3 fw-bold margin-bottom-8">
          { title }
        </div>
        <div className="fw-500 text-grayer">
          { message }
        </div>
      </div>
      <div className={`inline
            ${ showLoading ? '' : 'hidden' }
          `}>
        <img src={ require('@/assets/loading.svg') } className="width-72px" />
      </div>
    </div>
  );
}

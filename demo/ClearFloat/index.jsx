import React, { useState } from 'react';

import './index.css';

const ClearFloat = () => {
  const [clear, setClear] = useState(false);
  const [overflow, setOverflow] = useState(false);

  const onClearChange = (e) => {
    const checked = e.target.checked;

    setClear(checked);
  }

  const onOverflowChange = (e) => {
    const checked = e.target.checked;

    setOverflow(checked);
  }

  return (
    <>
      <div>
        清除浮动clear
        <input type="checkbox" checked={clear} onChange={onClearChange} />
        <span className="gap">|</span>
        清除浮动overflow
        <input type="checkbox" checked={overflow} onChange={onOverflowChange} />
      </div>
      <div className="demo-clear-float">
        <div className={`box-1 ${overflow ? 'overflow' : ''}`}>
          <div>父元素塌陷</div>
          <div className="float">我是浮动的，高度150px</div>
          {clear ? <div className="clear" /> : null}
        </div>
        <div className="box-2">box-2</div>
      </div>
    </>
  )
}

export default ClearFloat

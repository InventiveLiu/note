import React, { useState } from 'react';

import style from './index.css';

const ClearFloat = () => {
  const [clear, setClear] = useState(false);
  const [overflow, setOverflow] = useState(false);

  const onClearChange = e => {
    const checked = e.target.checked;

    setClear(checked);
  };

  const onOverflowChange = e => {
    const checked = e.target.checked;

    setOverflow(checked);
  };

  return (
    <>
      <div>
        清除浮动clear
        <input type="checkbox" checked={clear} onChange={onClearChange} />
        <span className={style.gap}>|</span>
        清除浮动overflow
        <input type="checkbox" checked={overflow} onChange={onOverflowChange} />
      </div>
      <div>
        <div className={`${style.box1} ${overflow ? style.overflow : ''}`}>
          <div>父元素塌陷</div>
          <div className={style.float}>我是浮动的，高度50px</div>
          {clear ? <div className={style.clear} /> : null}
        </div>
        <div className={style.box2}>box-2</div>
      </div>
    </>
  );
};

export default ClearFloat;

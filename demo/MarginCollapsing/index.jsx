import React, { useState } from 'react';

import style from './index.css';

const MarginCollapsing = () => {
  const [margin, setMargin] = useState(false);

  const onMarginChange = e => {
    const checked = e.target.checked;

    setMargin(checked);
  };

  return (
    <>
      <div>
        清除重叠
        <input type="checkbox" checked={margin} onChange={onMarginChange} />
      </div>
      <div>
        <div className={style.box1}>兄弟外边距合并</div>
        <div className={`${style.box2} ${margin ? style.margin : ''}`}>
          兄弟外边距合并
        </div>
      </div>
      <div className={`${style.parent} ${margin ? style.margin : ''}`}>
        <div className={style.child}>父子外边距合并</div>
      </div>
      <div>参照</div>
    </>
  );
};

export default MarginCollapsing;

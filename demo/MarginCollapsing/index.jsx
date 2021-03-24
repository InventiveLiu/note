import React, { useState } from 'react';

import './index.css';

const MarginCollapsing = () => {
  const [margin, setMargin] = useState(false);

  const onMarginChange = (e) => {
    const checked = e.target.checked;

    setMargin(checked);
  }

  return (
    <>
      <div>
        清除重叠
        <input type="checkbox" checked={margin} onChange={onMarginChange} />
      </div>
      <div className="demo-margin-collapsing">
        <div className="box-1">兄弟外边距合并</div>
        <div className={`box-2 ${margin ? 'margin' : ''}`}>兄弟外边距合并</div>
      </div>
      <div className={`parent ${margin ? 'margin' : ''}`}>
        <div className="child">父子外边距合并</div>
      </div>
      <div>参照</div>
    </>
  )
}

export default MarginCollapsing

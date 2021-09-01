import React, { useState } from 'react';

import style from './index.css';

const ThreeColumn = () => {
  const [sameHeight, setSameHeight] = useState(false);

  const onSameHeightChange = e => {
    const checked = e.target.checked;

    setSameHeight(checked);
  };

  return (
    <div className={style.wrap}>
      等高
      <input
        type="checkbox"
        checked={sameHeight}
        onChange={onSameHeightChange}
      />
      <div className={style.header}>header</div>
      <div
        className={style.content}
        style={
          sameHeight ? { alignItems: 'stretch' } : { alignItems: 'flex-start' }
        }
      >
        <div className={style.left}>
          <div>left content</div>
          <div>left content</div>
          <div>left content</div>
          <div>left content</div>
          <div>left content</div>
        </div>
        <div className={style.middle}>
          <div>middle content</div>
          <div>middle content</div>
          <div>middle content</div>
          <div>middle content</div>
          <div>middle content</div>
          <div>middle content</div>
          <div>middle content</div>
          <div>middle content</div>
          <div>middle content</div>
          <div>middle content</div>
          <div>middle content</div>
          <div>middle content</div>
        </div>
        <div className={style.right}>
          <div>right content</div>
          <div>right content</div>
          <div>right content</div>
          <div>right content</div>
          <div>right content</div>
          <div>right content</div>
          <div>right content</div>
        </div>
      </div>
      <div className={style.footer}>footer</div>
    </div>
  );
};

export default ThreeColumn;

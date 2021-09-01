import React, { useState } from 'react';

import style from './index.css';

const ThreeColumn = () => {
  const [radio, setRadio] = useState(0);
  const [sameHeight, setSameHeight] = useState(false);

  const changeRadio = value => () => {
    setRadio(value);
  };

  const onSameHeightChange = e => {
    const checked = e.target.checked;

    setSameHeight(checked);
  };

  return (
    <div className={style[`wrap${radio}`]}>
      <div>
        <label onClick={changeRadio(1)}>
          圣杯
          <input type="checkbox" checked={radio === 1} readOnly />
        </label>
        <label onClick={changeRadio(2)}>
          双飞翼
          <input type="checkbox" checked={radio === 2} readOnly />
        </label>
      </div>
      等高
      <input
        type="checkbox"
        checked={sameHeight}
        onChange={onSameHeightChange}
      />
      <div className={style.header}>header</div>
      <div className={style.content}>
        <div className={style.middle}>
          <div className={style.innerMiddle}>
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
        </div>
        <div
          className={style.left}
          style={
            sameHeight
              ? { paddingBottom: '100%', marginBottom: '-100%' }
              : undefined
          }
        >
          <div>left content</div>
          <div>left content</div>
          <div>left content</div>
          <div>left content</div>
          <div>left content</div>
        </div>
        <div
          className={style.right}
          style={
            sameHeight
              ? { paddingBottom: '100%', marginBottom: '-100%' }
              : undefined
          }
        >
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

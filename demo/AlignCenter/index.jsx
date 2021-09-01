import React from 'react';

import style from './index.css';

const AlignCenter = () => {
  return (
    <>
      <div className={style.section}>
        <div className={style.sectionName}>Flex</div>
        <div className={style.containerFlexJustify}>
          <div className={style.box}>justify-content+align-items</div>
        </div>
      </div>
      <div className={style.section}>
        <div className={style.sectionName}>Flex+margin: auto</div>
        <div className={style.containerFlexMargin}>
          <div className={`${style.box} ${style.boxMargin}`}>margin: auto</div>
        </div>
      </div>
      <div className={style.section}>
        <div className={style.sectionName}>transform</div>
        <div className={style.containerTransform}>
          <div className={`${style.boxTransform} ${style.box}`}>
            translate(-50%, -50%)
          </div>
        </div>
      </div>
      <div className={style.section}>
        <div className={style.sectionName}>vertical-align+伪元素</div>
        <div className={style.containerVertical}>
          <div className={`${style.boxVertical} ${style.box}`}>
            伪元素+vertical-align
          </div>
        </div>
      </div>
    </>
  );
};

export default AlignCenter;

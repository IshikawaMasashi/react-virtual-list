// import { render } from 'react-dom';
// import React from 'react';
// import App from './components/App';

// import './index.css';
// import '../scss/main.scss';

// render(<App />, document.getElementById('root'));

import * as React from "react";
import * as ReactDOM from "react-dom";

import VirtualList, { ItemStyle } from "../src/components";
import "./demo.css";
import { ALIGNMENT } from "../src/components/constants";

const Demo: React.FC<{}> = () => {
  const renderItem = ({
    style,
    index
  }: {
    style: ItemStyle;
    index: number;
  }) => {
    return (
      <div className="Row" style={style} key={index}>
        Row #{index}
      </div>
    );
  };

  return (
    <div className="Root">
      <VirtualList
        width="auto"
        height={400}
        itemCount={1000}
        renderItem={renderItem}
        itemSize={50}
        className="VirtualList"
        scrollToAlignment={ALIGNMENT.END}
        scrollToIndex={49}
      />
    </div>
  );
};

ReactDOM.render(<Demo />, document.getElementById("root"));

import React from "react";
import { ResizableBox as ReactResizableBox } from "react-resizable";

import "react-resizable/css/styles.css";
import useWindowDimensions from './../windowDimensions';

export default function ResizableBox({
  children,
  resizable = true,
  style = {},
  className
}) {
  const {height, width} = useWindowDimensions()
  return (
    <div>
      {resizable ? (
        <ReactResizableBox width={width} height={height}>
          <div
            style={{
              ...style,
              width: "90%",
              height: "40%",
              margin:'auto',
              marginBottom:0
            }}
            className={className}
          >
            {children}
          </div>
        </ReactResizableBox>
      ) : (
        <div
          style={{
            width: `${width-50}px`,
            height:`${height/3}px`,
            padding: '0',
            ...style
          }}
          className={className}
        >
          {children}
        </div>
      )}
    </div>
  );
}

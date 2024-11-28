import { NodeViewWrapper } from '@tiptap/react';

import React, { useState } from 'react';

export const Component = (props: any) => {
  const [count, setCount] = useState(0);

  const increase = () => {
    setCount((prev) => prev + 1);

    // @ts-ignore
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'increase',
        payload: { count: props.node.attrs.count + 1 },
      })
    );

    props.updateAttributes({
      count: props.node.attrs.count + 1,
    });
  };

  return (
    <NodeViewWrapper className="react-component">
      <button
        style={{
          marginLeft: 10,
          backgroundColor: count % 2 === 0 ? 'green' : 'red',
          border: '1px solid red',
          borderRadius: 6,
          fontSize: 16,
          userSelect: 'none',
        }}
        onClick={increase}
      >{`Clicked: ${props.node.attrs.count}`}</button>
    </NodeViewWrapper>
  );
};

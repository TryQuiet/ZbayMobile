import React from 'react';

import { renderComponent } from '../../utils/functions/renderComponent/renderComponent';
import { InitCheck } from './InitCheck.component';

describe('InitCheck component', () => {
  it('should match inline snapshot', () => {
    const { toJSON } = renderComponent(
      <InitCheck event={'websocket connected'} passed={true} />,
    );

    expect(toJSON()).toMatchInlineSnapshot();
  });
});

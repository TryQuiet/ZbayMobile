import React from 'react';

import { renderComponent } from '../../utils/functions/renderComponent/renderComponent';
import { MessageInput } from './MessageInput.component';

describe('MessageInput component', () => {
  it('should match inline snapshot', () => {
    const { toJSON } = renderComponent(
      <MessageInput placeholder={'Message #general as @holmes'} />,
    );

    expect(toJSON()).toMatchInlineSnapshot();
  });
});

import React from 'react';

import { renderComponent } from '../../utils/functions/renderComponent/renderComponent';
import { Button } from './Button.component';

describe('Button component', () => {
  it('should match inline snapshot', () => {
    const { toJSON } = renderComponent(<Button />);

    expect(toJSON()).toMatchInlineSnapshot();
  });
});

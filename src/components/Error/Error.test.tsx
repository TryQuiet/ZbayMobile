import React from 'react';

import { renderComponent } from '../../utils/functions/renderComponent/renderComponent';
import { Error } from './Error.component';

describe('Error component', () => {
  it('should match inline snapshot', () => {
    const { toJSON } = renderComponent(<Error />);

    expect(toJSON()).toMatchInlineSnapshot();
  });
});

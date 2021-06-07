import React from 'react';

import { renderComponent } from '../../utils/functions/renderComponent/renderComponent';
import { Loading } from './Loading.component';

describe('Loading component', () => {
  it('should match inline snapshot', () => {
    const { toJSON } = renderComponent(<Loading />);

    expect(toJSON()).toMatchInlineSnapshot();
  });
});

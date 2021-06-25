import React from 'react';

import { renderComponent } from '../../utils/functions/renderComponent/renderComponent';
import { Message } from './Message.component';

describe('Message component', () => {
  it('should match inline snapshot', () => {
    const { toJSON } = renderComponent(
      <Message
        message={{
          id: 'id',
          message:
            'Brownie powder marshmallow dessert carrot cake marzipan cake caramels. Muffin topping wafer jelly apple pie candy. Fruitcake chocolate pudding fruitcake candy lemon drops chocolate.',
          nickname: 'holmes',
          datetime: '1:30pm',
        }}
      />,
    );

    expect(toJSON()).toMatchInlineSnapshot();
  });
});

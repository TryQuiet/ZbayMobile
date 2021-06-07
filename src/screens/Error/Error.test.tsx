import { renderScreen } from '../../utils/functions/renderScreen/renderScreen';
import { ErrorScreen } from './Error.screen';

describe('ErrorScreen', () => {
  it('should match inline snapshot', () => {
    const { toJSON } = renderScreen(ErrorScreen);

    expect(toJSON()).toMatchInlineSnapshot();
  });
});

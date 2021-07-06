import { renderScreen } from '../../utils/functions/renderScreen/renderScreen';
import { RegistrationScreen } from './Registration.screen';

describe('RegistrationScreen', () => {
  it('should match inline snapshot', () => {
    const { toJSON } = renderScreen(RegistrationScreen);

    expect(toJSON()).toMatchInlineSnapshot();
  });
});

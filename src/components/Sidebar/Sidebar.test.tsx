
import React from 'react'

import { renderComponent } from '../../utils/functions/renderComponent/renderComponent'
import { Sidebar } from './Sidebar.component'

describe('Sidebar component', () => {
  it('should match inline snapshot', () => {
    const { toJSON } = renderComponent(<Sidebar />)

    expect(toJSON()).toMatchInlineSnapshot()
  })
})

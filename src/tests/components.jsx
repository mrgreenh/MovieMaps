import React from 'react';
import { mount } from 'enzyme';
import MoviesList from '../components/MoviesList.jsx';

describe('<Foo />', () => {

  it('calls componentDidMount', () => {
    const wrapper = mount(<Foo />);
    expect(Foo.prototype.componentDidMount.calledOnce).to.equal(true);
  });

});

import Component from '@glimmer/component';

export default class AkStackComponent extends Component {
  defaultTag = 'div';

  get tag() {
    return this.args.tag || this.defaultTag;
  }
}

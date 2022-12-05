import Component from '@glimmer/component';

export default class AkButtonComponent extends Component {
  get variant() {
    return this.args.variant || 'filled';
  }

  get color() {
    return this.args.color || 'primary';
  }

  noop() {}
}

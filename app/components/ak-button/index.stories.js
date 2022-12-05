import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'AkButton',
  component: 'ak-button',
  excludeStories: ['actionsData'],
};

export const actionsData = {};

const Template = (args) => ({
  template: hbs`
    <AkTypography @color="textSecondary" @gutterBottom={{true}}>Experiment with me</AkTypography>
    
    <AkButton 
        @class={{this.class}} 
        @type={{this.type}}
        @title={{this.title}}
        @disabled={{this.disabled}}>
        Filled Primary
    </AkButton>

    <AkButton 
        @class={{this.class}} 
        @type={{this.type}}
        @variant="outlined"
        @title={{this.title}}
        @disabled={{this.disabled}}>
        Outlined Primary
    </AkButton>

    <AkButton 
        @class={{this.class}} 
        @type={{this.type}}
        @color="neutral"
        @variant="outlined"
        @title={{this.title}}
        @disabled={{this.disabled}}>
        Outlined Neutral
    </AkButton>
  `,
  context: args,
});

export const Default = Template.bind({});

Default.args = {
  class: '',
  type: 'button',
  title: '',
  disabled: false,
};

const DisabledTemplate = (args) => ({
  template: hbs`
    <AkButton @disabled={{this.disabled}}>
        Filled Primary
    </AkButton>

    <AkButton @variant="outlined" @disabled={{this.disabled}}>
        Outlined Primary
    </AkButton>

    <AkButton @color="neutral" @variant="outlined" @disabled={{this.disabled}}>
        Outlined Neutral
    </AkButton>
  `,
  context: args,
});

export const Disabled = DisabledTemplate.bind({});

Disabled.args = {
  disabled: true,
};

const WithIconsTemplate = (args) => ({
  template: hbs`
    <AkButton>
        <:leftIcon>
            <span class="ak-icon ak-icon-delete"></span>
        </:leftIcon>

        <:default>
            Delete
        </:default>
    </AkButton>

    <AkButton @variant="outlined">
        <:leftIcon>
            <span class="ak-icon ak-icon-note-add"></span>
        </:leftIcon>

        <:default>Add Note</:default>
    </AkButton>

    <AkButton @color="neutral" @variant="outlined">
        <:leftIcon>
            <span class="ak-icon ak-icon-refresh"></span>
        </:leftIcon>
        
        <:default>Refresh</:default>
    </AkButton>
  `,
  context: args,
});

export const WithIcons = WithIconsTemplate.bind({});

WithIcons.args = {};

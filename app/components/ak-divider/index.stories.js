import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'AkDivider',
  component: 'ak-divider',
  excludeStories: [],
};

const listData = [
  { label: 'Projects', icon: 'folder', divider: true },
  { label: 'Store Monitoring', icon: 'inventory-2', divider: true },
  { label: 'Analytics', icon: 'graphic-eq', divider: true },
  { label: 'Organization', icon: 'people', divider: true },
  { label: 'Settings', icon: 'account-box' },
];

const Template = (args) => ({
  template: hbs`
    <AkTypography @color="textSecondary" @gutterBottom={{true}}>Experiment with me</AkTypography>
    
    <div {{style backgroundColor="#f5f5f5"}} class="flex-row flex-align-center flex-justify-center p-3 w-full m-3">
        <div {{style backgroundColor="#ffffff"}} class="w-6/12">
            <AkList as |akl|>
                {{#each this.listData as |data idx|}}
                    <akl.listItem as |li|>
                        <li.leftIcon>
                            <AkIcon @iconName={{data.icon}} />
                        </li.leftIcon>

                        <li.text @primaryText={{data.label}} /> 

                        {{#if (eq idx 0)}}
                            123
                        {{/if}}
                    </akl.listItem>

                    {{#if data.divider}}
                        <AkDivider @tag={{this.tag}} @variant={{this.variant}} @color={{this.color}} />
                    {{/if}}
                {{/each}}
           </AkList>
        </div>
    </div>
  `,
  context: { ...args, listData },
});

export const Default = Template.bind({});

Default.args = {
  tag: 'li',
  variant: 'fullWidth',
  color: 'light',
};

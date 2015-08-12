`import Ember from 'ember';`
`import ENV from 'irene/config/environment';`
`import Notify from 'ember-notify';`

JiraSelectorComponent = Ember.Component.extend

  isOpen: false
  project: null
  jiraProjects: ["Loading..."]
  classNames: ['btn-group']
  classNameBindings: ['isOpen:open']

  fetchJiraProjects: (->
    return if ENV.environment is "test"
    url = [ENV.APP.API_BASE, ENV.endpoints.jiraProjects].join '/'
    that = @
    Ember.$.get url
    .then (data)->
      that.set "jiraProjects", data.projects
    .fail ->
      Notify.error "Something went wrong when trying to fetch projects list."

  ).on "init"

  actions:

    toggleDropdown: ->
      @set "isOpen", !@get "isOpen"

    selectProject: (project)->
      @set "isOpen", false
      projectId = @get "project.id"
      url = [ENV.APP.API_BASE, ENV.endpoints.setJira, projectId].join '/'
      that = @
      data =
        project: project
      Ember.$.post url, data
      .then (data)->
        Notify.success "Repo successfully integrated"
      .fail ->
        Notify.error "Something went wrong whe trying to update this repo"

`export default JiraSelectorComponent`
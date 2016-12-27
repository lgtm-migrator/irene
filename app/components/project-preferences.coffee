`import Ember from 'ember'`
`import ENUMS from 'irene/enums';`
`import ENV from 'irene/config/environment';`

devices = ENUMS.DEVICE_TYPE.CHOICES.reverse()[1..]

ProjectPreferencesComponent = Ember.Component.extend
  devices: devices
  project: null
  versions: ["Loading..."]
  availableDevices: ["Loading..."]
  currentDevice: ["Loading..."]


  actions:
    deviceChanged: (value) ->
      that = @
      that.set "currentDevice", parseInt value

      platform = @get "project.platform"
      currentDevice = @get "currentDevice"

      @get("ajax").request ENV.endpoints.devices
      .then (data) ->
        if platform is ENUMS.PLATFORM.ANDROID
          versions = that.set "versions", data
          if currentDevice is ENUMS.DEVICE_TYPE.PHONE_REQUIRED
            that.set "availableDevices", versions.devices.filterBy("platform", 0).filterBy("is_tablet",false)
          else if currentDevice is ENUMS.DEVICE_TYPE.TABLET_REQUIRED
            that.set "availableDevices", versions.devices.filterBy("platform", 0).filterBy("is_tablet",true)
          else
            that.set "availableDevices", versions.devices.filterBy("platform", 0)
        else if platform is ENUMS.PLATFORM.IOS
          versions = that.set "versions", data
          if currentDevice is ENUMS.DEVICE_TYPE.PHONE_REQUIRED
            that.set "availableDevices", versions.devices.filterBy("platform", 1).filterBy("is_tablet",false)
          else if currentDevice is ENUMS.DEVICE_TYPE.TABLET_REQUIRED
            that.set "availableDevices", versions.devices.filterBy("platform", 1).filterBy("is_tablet",true)
          else
            that.set "availableDevices", versions.devices.filterBy("platform", 1)
        else
          versions = that.set "versions", data
          if currentDevice is ENUMS.DEVICE_TYPE.PHONE_REQUIRED
            that.set "availableDevices", versions.devices.filterBy("platform", 1).filterBy("is_tablet",false)
          else if currentDevice is ENUMS.DEVICE_TYPE.TABLET_REQUIRED
            that.set "availableDevices", versions.devices.filterBy("platform", 1).filterBy("is_tablet",true)
          else
            that.set "availableDevices", versions.devices.filterBy("platform", 1)
      .catch (error) ->
        that.get("notify").error "failed"
        if Ember.isEmpty error?.errors
          return
        for error in error.errors
          that.get("notify").error error.detail?.message

    versionSelected: ->
      deviceChoosen = @$('#device').val()
      versionChoosen = @$('#version').val()
      projectId = @get "project.id"
      devicePreferences = [ENV.endpoints.devicePreferences, projectId].join '/'
      that = @
      data =
        deviceChoosen: deviceChoosen
        versionChoosen: versionChoosen
      @get("ajax").post devicePreferences, data: data
      .then (data) ->
        that.get("notify").success "You have sucessfully selected the device"
      .catch (error) ->
        that.get("notify").error "failed"
        if Ember.isEmpty error?.errors
          return
        for error in error.errors
          that.get("notify").error error.detail?.message

`export default ProjectPreferencesComponent`

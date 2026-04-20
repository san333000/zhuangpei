let store = null;
let requestUtil = null;
let cloudBackend = null;
let cloudSync = null;
let sessionUtil = null;
try {
  store = require('./utils/store');
} catch (error) {
  store = null;
}
try {
  requestUtil = require('./utils/request');
} catch (error) {
  requestUtil = null;
}
try {
  cloudBackend = require('./utils/cloud-backend');
} catch (error) {
  cloudBackend = null;
}
try {
  cloudSync = require('./utils/cloud-sync');
} catch (error) {
  cloudSync = null;
}
try {
  sessionUtil = require('./utils/session');
} catch (error) {
  sessionUtil = null;
}

App({
  onLaunch() {
    let cloudRuntime = {
      enabled: false,
      mode: 'local',
      envId: '',
      initedAt: 0,
      syncStatus: 'idle',
      lastSyncAt: 0,
      syncError: ''
    };
    if (cloudBackend && cloudBackend.initCloudRuntime) {
      cloudRuntime = cloudBackend.initCloudRuntime();
    }
    this.globalData.cloud = cloudRuntime;

    if (store && store.ensureStore) {
      store.ensureStore();
    }
    let role = '';
    if (store && store.getRole) {
      role = store.getRole();
    }
    if (!role) {
      role = wx.getStorageSync('role');
    }
    if (!role) role = 'bride';
    wx.setStorageSync('role', role);
    this.globalData.role = role;
    if (store && store.getActiveArtistId) {
      this.globalData.activeArtistId = store.getActiveArtistId();
    }
    if (sessionUtil && sessionUtil.ensureLocalSession) {
      const localSession = sessionUtil.ensureLocalSession(role);
      this.globalData.session = localSession;
    }
    const apiBaseUrl = wx.getStorageSync('apiBaseUrl') || '';
    this.globalData.apiBaseUrl = apiBaseUrl;
    this.globalData.network = {
      timeout: requestUtil ? requestUtil.DEFAULT_TIMEOUT : 10000,
      retries: requestUtil ? requestUtil.DEFAULT_RETRIES : 2,
      retryDelay: requestUtil ? requestUtil.DEFAULT_RETRY_DELAY : 600
    };
    this.globalData.runtime = this.globalData.runtime || {
      pendingMatchPayload: null,
      latestMatchResult: null
    };

    if (
      cloudRuntime.enabled
      && cloudSync
      && cloudSync.pullLatestStoreSnapshot
      && store
      && store.readStore
      && store.writeStore
    ) {
      cloudSync.pullLatestStoreSnapshot(store).then((result) => {
        if (!result || !result.ok || !result.pulled) return;
        if (store && store.getRole) {
          const role = store.getRole();
          this.globalData.role = role || this.globalData.role;
        }
        if (store && store.getActiveArtistId) {
          this.globalData.activeArtistId = store.getActiveArtistId() || this.globalData.activeArtistId;
        }
      }).catch(() => {});
    }

    if (sessionUtil && sessionUtil.resolveCloudSession) {
      sessionUtil.resolveCloudSession(role, cloudBackend).then((session) => {
        this.globalData.session = session || this.globalData.session;
        if (sessionUtil.applySessionToApp) {
          sessionUtil.applySessionToApp(this.globalData.session);
        }
      }).catch(() => {});
    }
  },
  globalData: {
    role: 'bride',
    activeArtistId: '',
    apiBaseUrl: '',
    network: {
      timeout: 10000,
      retries: 2,
      retryDelay: 600
    },
    runtime: {
      pendingMatchPayload: null,
      latestMatchResult: null
    },
    cloud: {
      enabled: false,
      mode: 'local',
      envId: '',
      initedAt: 0,
      syncStatus: 'idle',
      lastSyncAt: 0,
      syncError: ''
    },
    session: null,
    theme: {
      cream: '#FAF9F6',
      champagne: '#D4AF37',
      champagneLight: '#F4E8C8',
      charcoal: '#2C2C2C',
      ash: '#8E8E8E'
    }
  }
});

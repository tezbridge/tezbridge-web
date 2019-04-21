<template>
  <div class="block">
    <b-modal v-model="adding_manager_modal" id="modal-add" size="xl" :title="lang.manager.add_manager" ok-variant="secondary" ok-only :ok-title="lang.cancel">
      <b-tabs card v-model="tab_index">
        <b-tab :title="lang.manager.create_tab" active>
          <gen-new-key @key_selected="genKeyUsed"></gen-new-key>
        </b-tab>
        <b-tab :title="lang.manager.import_tab">
          <import-key :userkey="generated_key" @manager_added="adding_manager_modal = false"></import-key>
        </b-tab>
      </b-tabs>
    </b-modal>
    <div class="top-panel">
      <b-button size="sm" v-b-modal.modal-add>+</b-button>
    </div>
    <div class="block-title">{{lang.manager.select_manager + ':'}}</div>
    <b-form v-if="managers.length">
      <b-form-group>
        <b-form-radio-group v-model="selected_manager" name="manager">
          <b-form-radio :value="manager" v-for="manager in managers">
            <span>{{manager.name}}</span>
          </b-form-radio>
        </b-form-radio-group>
      </b-form-group>
      <b-form-group
        :label="lang.password + ':'"
        :invalid-feedback="lang.password_incorrect"
        :valid-feedback="lang.password_correct">
        <b-input type="password" v-model.trim="password" :state="passing_box === null ? null : !!passing_box"></b-input>
      </b-form-group>

      <b-button size="sm" variant="primary" :disabled="!passing_box" @click="confirm">{{lang.confirm}}</b-button>

    </b-form>
  </div>
</template>

<script>
// @flow

import TBC from 'tezbridge-crypto'
import lang from '../../langs'
import storage from '../../libs/storage'
import { debounce } from '../../libs/util'

import ImportKey from './ImportKey'
import GenNewKey from './GenNewKey'

export default {
  components: {
    ImportKey,
    GenNewKey
  },
  data() {
    return {
      lang,
      adding_manager_modal: false,
      tab_index: 0,
      generated_key : '',
      managers: [],
      selected_manager: '',
      password: '',
      passing_box: null
    }
  },
  mounted() {
    this.managers = storage.managers
  },
  watch: {
    selected_manager() {
      this.passing_box = null
      this.password = ''
    },
    password: debounce(function(p : string) {
      if (!this.selected_manager)
        return false

      const box = new TBC.crypto.EncryptedBox(this.selected_manager.enc)
      box.reveal(p)
      .then(raw_key => {
        this.passing_box = new TBC.crypto.EncryptedBox(raw_key)
      })
      .catch(() => {
        this.passing_box = false
      })
    })
  },
  methods: {
    genKeyUsed(key : string) {
      this.generated_key = key
      this.tab_index = 1
    },
    confirm() {
      this.$emit('selected', [this.passing_box, this.selected_manager.name])
      this.passing_box = null
    }
  }
}

</script>

<style scoped>
.top-panel { float: right; }
</style>
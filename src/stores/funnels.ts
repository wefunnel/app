import { Api, JsonRpc, RpcError } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { TextEncoder, TextDecoder } from 'util'
const { Aes, PublicKey, ...ecc} = require('eosjs-ecc')

export interface Funnel {
  username: string
  rate: number
  incoming_uri_enc: string
  outgoing_uri_enc: string
  funnel_uri_enc: string
  active: 0|1
  client: string
}

export default {
  state: {
    contractName: 'wefunnel2222',
    defaultPrivateKey: '5JqbA89QUhR6nkJX13cZxADNL4pca1FrABufUc3qcyhRRmgMRzp',
    funnels: [] as Funnel[],
  },
  actions: {
    loadFunnels: async ({ state }: any) => {
      const rpc = new JsonRpc('http://127.0.0.1:8888')
      const { rows } = await rpc.get_table_rows({
        json: true,
        code: state.contractName,
        scope: state.contractName,
        table: 'funnels',
        limit: 20,
      })
      state.funnels = [...state.funnels, ...rows]
    },
    leaseFunnel: async ({ state }: any, funnel: Funnel) => {
      const incoming = '192.168.1.3'
      const outgoing = '172.98.67.83:502'
      const rpc = new JsonRpc('http://127.0.0.1:8888')
      const { permissions } = await rpc.get_account(funnel.username)
      const ownerPerm = permissions.find((perm: any) => perm.perm_name === 'owner')
      const publicKey = PublicKey(ownerPerm.required_auth.keys[0].key)
      const incoming_enc = Aes.encrypt(
        state.defaultPrivateKey,
        publicKey.toString(),
        incoming,
      )
      const outgoing_enc = Aes.encrypt(
        state.defaultPrivateKey,
        publicKey.toString(),
        outgoing
      )
      const signatureProvider = new JsSignatureProvider([state.defaultPrivateKey])
      const api = new Api({
        rpc,
        signatureProvider,
        textDecoder: new TextDecoder(),
        textEncoder: new TextEncoder(),
      })
      const result = await api.transact({
        actions: [{
          account: state.contractName,
          name: 'leasefunnel',
          authorization: [{
            actor: 'seetheory333',
            permission: 'active',
          }],
          data: {
            funnel_username: funnel.username,
            username: 'seetheory333',
          },
        }, {
          account: state.contractName,
          name: 'setinouturis',
          authorization: [{
            actor: 'seetheory333',
            permission: 'active',
          }],
          data: {
            username: funnel.username,
            incoming_uri_enc: JSON.stringify({
              nonce: incoming_enc.nonce,
              message: incoming_enc.message.toString('base64'),
              checksum: incoming_enc.checksum,
            }),
            outgoing_uri_enc: JSON.stringify({
              nonce: outgoing_enc.nonce,
              message: outgoing_enc.message.toString('base64'),
              checksum: outgoing_enc.checksum,
            })
          }
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      })
      console.log(result)
    }
  }
}

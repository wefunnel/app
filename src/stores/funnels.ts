import { Api, JsonRpc, RpcError } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { TextEncoder, TextDecoder } from 'util'
const { Aes, PublicKey, ...ecc} = require('eosjs-ecc')
import { Long } from 'bytebuffer'
import store from '.'

export interface Funnel {
  username: string
  rate: number
  incoming_uri_enc: string
  outgoing_uri_enc: string
  funnel_uri_enc: string
  active: 0|1
  client: string
  funnel_uri?: string
  incoming_uri?: string
  outgoing_uri?: string
}

const RPC_URL = 'http://127.0.0.1:8888'

export async function publicKeyForUsername(username: string) {
  const rpc = new JsonRpc(RPC_URL)
  const { permissions } = await rpc.get_account(username)
  const ownerPerm = permissions.find((perm: any) => perm.perm_name === 'owner')
  return PublicKey(ownerPerm.required_auth.keys[0].key)
}

export async function decryptData(ownerKey: string, data: string) {
  const { nonce, message, checksum } = JSON.parse(data)
  return Aes.decrypt(
    store.state.defaultPrivateKey,
    ownerKey.toString(),
    new Long(nonce.low, nonce.high, nonce.unsigned),
    Buffer.from(message, 'base64'),
    checksum
  ).toString()
}

async function loadFunnel(username: string) {
  const rpc = new JsonRpc(RPC_URL)
  const { rows } = await rpc.get_table_rows({
    json: true,
    code: store.state.contractName,
    scope: store.state.contractName,
    table: 'funnels',
    limit: 1,
    lower_bound: username,
  })
  const [ funnel ] = rows
  return funnel
}

export async function listFunnels(offset = 0, limit = 20) {
  const rpc = new JsonRpc(RPC_URL)
  const { rows } = await rpc.get_table_rows({
    json: true,
    code: store.state.contractName,
    scope: store.state.contractName,
    table: 'funnels',
    limit,
  })
  return rows
}

/**
 * All of the relays being leased by the current user
 **/
export async function listOwnedRelays(offset = 0, limit = 100) {
  const rpc = new JsonRpc(RPC_URL)
  const { rows } = await rpc.get_table_rows({
    json: true,
    code: store.state.contractName,
    scope: store.state.contractName,
    table: 'funnels',
    limit,
    index_position: 'secondary',
    upper_bound: store.state.username,
    lower_bound: store.state.username,
    key_type: 'i64'
  })
  console.log(rows)
  return rows
}

export async function listAvailableFunnels(offset = 0, limit = 20) {
  const rpc = new JsonRpc(RPC_URL)
  const { rows } = await rpc.get_table_rows({
    json: true,
    code: store.state.contractName,
    scope: store.state.contractName,
    table: 'funnels',
    index_position: 'tertiary',
    limit,
    upper_bound: 0,
    key_type: 'i64'
  })
  console.log(rows)
  return rows
}

export async function freeFunnel(owner: string) {
  const rpc = new JsonRpc(RPC_URL)
  const signatureProvider = new JsSignatureProvider([store.state.defaultPrivateKey])
  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder(),
  })
  await api.transact({
    actions: [{
      account: store.state.contractName,
      name: 'freefunnel',
      authorization: [{
        actor: store.state.username,
        permission: 'active',
      }],
      data: {
        funnel_username: owner,
      }
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  })
}

export async function leaseFunnel(owner: string, incomingIp: string, outgoingUri: string) {
  const rpc = new JsonRpc(RPC_URL)
  const { permissions } = await rpc.get_account(owner)
  const ownerPerm = permissions.find((perm: any) => perm.perm_name === 'owner')
  const publicKey = PublicKey(ownerPerm.required_auth.keys[0].key)
  const incoming_enc = Aes.encrypt(
    store.state.defaultPrivateKey,
    publicKey.toString(),
    incomingIp,
  )
  const outgoing_enc = Aes.encrypt(
    store.state.defaultPrivateKey,
    publicKey.toString(),
    outgoingUri
  )
  const signatureProvider = new JsSignatureProvider([store.state.defaultPrivateKey])
  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder(),
  })
  await api.transact({
    actions: [{
      account: store.state.contractName,
      name: 'leasefunnel',
      authorization: [{
        actor: store.state.username,
        permission: 'active',
      }],
      data: {
        funnel_username: owner,
        username: store.state.username,
      },
    }, {
      account: store.state.contractName,
      name: 'setinouturis',
      authorization: [{
        actor: store.state.username,
        permission: 'active',
      }],
      data: {
        username: owner,
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
}

export async function funnelConfirm(username: string) {
  const relays = await listOwnedRelays()
  // Username should be unique in owned relays, e.g. not leasing 2 machines from the same user
  const relay = relays.find((_relay: Funnel) => username === _relay.username)
  if (!relay) {
    console.log('No relays owned by user')
    return
  }
  if (!relay.active) {
    console.log('Relay is not active')
    return
  }
  if (!relay.funnel_uri_enc) {
    await new Promise(r => setTimeout(r, 2500))
    await funnelConfirm(username)
    return
  }
  if (relay.funnel_uri) {
    return
  }
}

export const users = [
  { id: 'u1', name: 'Lưu Bảo', email: 'bao@example.com', roles: ['coowner'] },
  { id: 'u2', name: 'Minh', email: 'minh@example.com', roles: ['staff'] }
]

export function mockLogin(email) {
  return users.find(u => u.email === email) || users[0]
}

export const mockGroups = [
  {
    id: 'g1',
    name: 'Group — VinFast VF8',
    vehicle: { id: 'v1', plate: '30A-123.45', model: 'VF8', odometer: 12500 },
    members: [ { userId: 'u1', name: 'Lưu Bảo', share: 40, role: 'groupAdmin' }, { userId: 'u2', name: 'Minh', share: 60, role: 'member' } ],
    commonFund: { balance: 2500000 }
  }
]

export const mockBookings = [
  { id: 'b1', groupId: 'g1', userId: 'u1', startAt: new Date().toISOString(), endAt: new Date(Date.now()+2*3600*1000).toISOString(), status: 'approved' }
]
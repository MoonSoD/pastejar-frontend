import ky from 'ky'

const client = ky.create({
  prefixUrl: 'http://localhost:8080/api',
  hooks: {
    beforeRequest: [
      request => {
        if (request.url.includes("/users/me") || request.url.includes("/users/register")) 
          return

        request.headers.set('Authorization', `Basic ${localStorage.getItem('auth')}`)
      }
    ]
  }
})

export default client
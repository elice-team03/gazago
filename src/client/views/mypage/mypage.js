import * as Api from '/api.js';

async function getUserOrderList () {
  try {
    const result = await Api.get('http://localhost:5001/api/users')
    if(result.code === 200) {
      
    }
  } catch (error) {
    
  }
}
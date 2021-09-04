$(() => {
  // signup
  $('#signup-submit').click((e) => {
    e.preventDefault()
    const username = $('#username').val()
    const password1 = $('#password1').val()
    const password2 = $('#password2').val()

    if (username.length < 6) {
      $('#error-text').text('Username should be atleast 6 characters')
      $('.error').css('display', 'flex')
    } else if (password1 !== password2) {
      $('#error-text').text('passwords do not match')
      $('.error').css('display', 'flex')
    } else if (password2.length < 6) {
      $('#error-text').text('password too short')
      $('.error').css('display', 'flex')
    } else {
      const results = $.post(
        '/api/signup',
        {
          username,
          password2,
        },
        (data, status) => {
          if (data.status === 11000) {
            $('#error-text').text(data.msg)
            $('.error').css('display', 'flex')
          }
          if (data.msg === 'user created') {
            $('#error-text').text('account created successfully')
            $('.error').css({ display: 'flex', background: 'green' })
          }
        }
      )
    }
  })
  $('.clsbtn').on('click', () => {
    $('.show').hide(500)
  })

  // LOGIN

  $('#login-submit').click((e) => {
    e.preventDefault()
    const username = $('#username').val()
    const password = $('#password').val()

    if (username.trim().length === 0 || password.trim().length === 0) {
      $('#error-text').text('Invalid username or password')
      $('.error').css('display', 'flex')
    } else {
      const results = $.post(
        '/api/login',
        {
          username,
          password,
        },
        (data, status) => {
          if (data.status === 'error' || data.status == 400) {
            $('#error-text').text('Invalid username or password')
            $('.error').css('display', 'flex')
          } else {
            $('#error-text').text(data.status)
            $('.error').css({ display: 'flex', background: 'green' })

            localStorage.setItem('token', data.msg)
          }
        }
      )
    }
  })

  // TOKEN
  $('#token-submit').click(async (e) => {
    e.preventDefault()
    const jwttoken = $('#token').val()
    const results = await fetch('/api/home', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jwttoken,
        token: localStorage.getItem('token'),
      }),
    })
  })
})

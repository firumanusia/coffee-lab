import { useState, type FormEvent } from 'react'
import { useLogin, useNotify } from 'react-admin'
import { Box, Button, Card, CardContent, CircularProgress, TextField, Typography } from '@mui/material'

export const LoginPage = () => {
  const login = useLogin()
  const notify = useNotify()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    login({ username: email, password }).catch(() => {
      notify('Invalid credentials or not an admin account', { type: 'warning' })
      setLoading(false)
    })
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background:
          'radial-gradient(1200px 600px at 80% -10%, rgba(232,75,61,0.14), transparent 60%),' +
          'radial-gradient(900px 520px at -10% 110%, rgba(6,148,148,0.14), transparent 55%), #faf7f4',
      }}
    >
      <Card sx={{ width: 380, borderRadius: 4, boxShadow: '0 16px 50px rgba(43,36,34,0.15)' }}>
        <CardContent component="form" onSubmit={submit} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
            <img src="/img/Logo Light v2.png" alt="MENOOWEL" style={{ height: 52, width: 'auto' }} />
          </Box>
          <Typography align="center" variant="body2" sx={{ mb: 3, color: 'text.secondary', fontWeight: 600 }}>
            BrewLab Studio — Admin
          </Typography>
          <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ mt: 3, py: 1.2, fontWeight: 700 }}>
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign in'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}

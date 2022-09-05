import React from 'react'
import logo from './logo.svg'
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NameForm from './NameForm'

function App() {
	const queryClient = new QueryClient()

	return (
		<div className='App'>
			<QueryClientProvider client={queryClient}>
				<NameForm />
			</QueryClientProvider>
		</div>
	)
}

export default App

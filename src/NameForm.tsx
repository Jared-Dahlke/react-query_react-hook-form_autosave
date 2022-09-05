import React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import debounce from 'just-debounce-it'

type NameType = {
	id: number
	firstName: string
	lastName: string
}

const schemaValidation = Yup.object().shape({
	id: Yup.number().required('Required'),
	firstName: Yup.string().required('Required'),
	lastName: Yup.string()
		.min(2, 'Must be greater than 1 character')
		.max(50, 'Must be less than 30 characters')
})

const getMockData = async () => {
	const name: NameType = {
		id: 1,
		firstName: 'John',
		lastName: 'Doe'
	}
	return await Promise.resolve(name)
}

const saveChangeToDatabase = async (args: NameType) => {
	console.count('payload for patch:' + JSON.stringify(args))
	return await Promise.resolve(args)
}

const NameForm = () => {
	const queryResult = useQuery(['user'], getMockData)
	const mutationResult = useMutation(saveChangeToDatabase, {
		onSuccess: (nameToSave: NameType) => {
			console.count('success mutating: ' + JSON.stringify(nameToSave))
		}
	})

	const {
		register,
		reset,
		watch,
		formState: { isValid, isDirty, errors }
	} = useForm<NameType>({
		mode: 'all',
		criteriaMode: 'all',
		resolver: yupResolver(schemaValidation)
	})
	const fieldData = watch()

	const handleDebouncedChange = debounce((data: NameType) => {
		mutationResult.mutateAsync(data)
	}, 500)

	React.useEffect(() => {
		reset(queryResult.data)
	}, [queryResult.data])

	React.useEffect(() => {
		if (isValid && isDirty) {
			handleDebouncedChange(fieldData)
		}
	}, [fieldData, isValid, isDirty])

	if (queryResult.isLoading) {
		return <h2>Loading...</h2>
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				margin: 'auto',
				width: 300
			}}>
			<input {...register('firstName')} placeholder='First name' />
			<div style={{ color: 'red' }}>{errors && errors?.firstName?.message}</div>
			<input {...register('lastName')} placeholder='Last name' />
			<div style={{ color: 'red' }}>{errors && errors?.lastName?.message}</div>
			{'Field data: ' + JSON.stringify(fieldData)}
		</div>
	)
}

export default NameForm

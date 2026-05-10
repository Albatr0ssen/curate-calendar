<script>
	import { login } from '$lib/remote/auth.remote';
</script>

<div class="flex h-screen w-screen items-center justify-center">
	<div class="w-175 p-5">
		<form
			class="flex w-full flex-col items-center gap-5 rounded-xl bg-green-200 pt-12 pb-12"
			{...login}
		>
			<input
				class="w-[80%] rounded-lg bg-white p-2 lg:w-[50%]"
				placeholder="Username"
				{...login.fields.username.as('text')}
			/>
			<input
				class="w-[80%] rounded-lg bg-white p-2 lg:w-[50%]"
				placeholder="Password"
				{...login.fields.password.as('password')}
			/>
			<span>{login.result?.error}</span>
			<button class="w-[50%] rounded-lg bg-white p-2 lg:w-[30%]">Login!</button>
		</form>
	</div>
</div>

<script>
	import { login, signup } from '$lib/remote/auth.remote';
</script>

<div class="flex h-screen w-screen items-center justify-center">
	<div class="p-5 md:w-full lg:w-[30%]">
		<form
			class="flex w-full flex-col items-center gap-5 rounded-xl bg-green-200 pt-12 pb-12"
			{...signup}
		>
			<input
				class="w-[50%] rounded-lg bg-white p-2"
				placeholder="Username"
				{...login.fields.username.as('text')}
			/>
			<input
				class="w-[50%] rounded-lg bg-white p-2"
				placeholder="Password"
				{...login.fields.password.as('password')}
			/>
			<button class="w-[30%] rounded-lg bg-white p-2">Signup!</button>
		</form>
	</div>
</div>

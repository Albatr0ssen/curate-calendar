<script>
	import { login } from '$lib/remote/auth.remote';
</script>

<div class="flex h-screen w-screen items-center justify-center">
	<div class="w-175 p-20">
		<form
			class="flex w-full flex-col items-center gap-5 rounded-xl bg-green-200 pt-12 pb-12"
			{...login}
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
			<button class="w-[30%] rounded-lg bg-white p-2">Login!</button>
		</form>
	</div>
</div>

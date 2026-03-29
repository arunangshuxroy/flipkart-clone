const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://gdpqvmpvejdrqwcuohry.supabase.co",
  "sb_publishable_xNyzLHSRbLu8K0C9q7xh4A_XHR7uU7F"
);

async function test() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Products count:", data.length);
  }
}
test();

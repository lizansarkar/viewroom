import Button from "./Button";

function ExampleUsage() {
  return (
    <div className="flex gap-4 p-4">
      {/* ইমেজের বাম পাশের গ্রে বাটন */}
      <Button variant="primary">Button</Button>

      {/* ইমেজের ডান পাশের লাইট বাটন */}
      <Button variant="secondary">Button</Button>
    </div>
  );
}

export default ExampleUsage;
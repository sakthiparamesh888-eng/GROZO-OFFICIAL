# SocialMedia Sheet

Create a sheet tab named `SocialMedia` with these columns:

| platform | title | url | thumbnail | icon | followers | active |
|---|---|---|---|---|---|---|

## Row Types

### Profile cards and floating links

Use `instagram`, `youtube`, `whatsapp`, or `call` in `platform`.

The `title` cell supports a heading followed by card benefits separated with `|`:

```text
Follow Us On Instagram|Daily Fresh Vegetable Updates|Farm Photos|Customer Reviews|Special Offers
```

Set `url` to the profile, WhatsApp, or `tel:` URL. Set `followers` to text such as
`10K+ followers`.

### Reels and videos

Use one row per item:

- `instagram_reel`
- `youtube_video`
- `testimonial`

Set `title`, `url`, and `thumbnail`. The website displays the latest active rows
in sheet order.

### Editable section copy

Use these values in `platform`; put the displayed text in `title`:

- `config_eyebrow`
- `config_heading`
- `config_subheading`
- `config_instagram_heading`
- `config_youtube_heading`
- `config_trust_eyebrow`
- `config_trust_heading`
- `config_trust_subheading`
- `config_exit_eyebrow`
- `config_exit_heading`
- `config_exit_subheading`

### Trust counters

Use `metric_` followed by a unique key, for example `metric_customers`.

- `title`: counter label
- `followers`: animated value, such as `1000+`, `4.9`, or `100%`
- `icon`: `users`, `orders`, `truck`, `star`, or `leaf`

Set `active` to `TRUE` to display a row and `FALSE` to hide it.
